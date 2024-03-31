import React, { useState, useEffect } from "react";
import { Flex, Text, Icon, Tooltip } from "@chakra-ui/react";
import { FaBitcoin } from "react-icons/fa";

const NextHalvingInfo = ({ showTooltip = false }) => {
  const [daysUntilHalving, setDaysUntilHalving] = useState(null);
  const [remainingBlocks, setRemainingBlocks] = useState(null);
  const [approximateBlockTime, setApproximateBlockTime] = useState(null);

  useEffect(() => {
    const fetchCurrentBlockHeight = async () => {
      try {
        const response = await fetch("https://blockchain.info/q/getblockcount");
        if (!response.ok) {
          throw new Error("Failed to fetch current block height");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching current block height:", error.message);
        return null;
      }
    };

    const calculateNextHalving = async () => {
      try {
        const currentBlockHeight = await fetchCurrentBlockHeight();
        if (currentBlockHeight === null) {
          return null;
        }

        const halvingInterval = 210000; // Blocks
        const averageBlockTime = 10; // Minutes

        const nextHalvingBlockHeight = Math.ceil(currentBlockHeight / halvingInterval) * halvingInterval;
        const blocksUntilHalving = nextHalvingBlockHeight - currentBlockHeight;
        const minutesUntilHalving = blocksUntilHalving * averageBlockTime;
        const daysUntilHalving = Math.ceil(minutesUntilHalving / 1440); // 1440 minutes in a day

        const remainingBlocks = blocksUntilHalving;
        const approximateBlockTime = averageBlockTime;

        setRemainingBlocks(remainingBlocks);
        setApproximateBlockTime(approximateBlockTime);

        return daysUntilHalving;
      } catch (error) {
        console.error("Error calculating next halving:", error.message);
        return null;
      }
    };

    calculateNextHalving().then((days) => {
      setDaysUntilHalving(days);
    });
  }, []);

  return (
    <Tooltip label={`Remaining Blocks: ${remainingBlocks}, Approximate Block Time: ${approximateBlockTime} minutes`} aria-label="A tooltip">
      <Flex alignItems="center">
        <Icon as={FaBitcoin} color="orange.400" mr={2} />
        <Text mr={2}>Next Halving: </Text>
        <Text fontWeight="bold" as="span" textShadow="0 0 10px rgba(255, 255, 255, 0.75)">
          {daysUntilHalving !== null ? daysUntilHalving + " days" : "Loading..."}
        </Text>
      </Flex>
    </Tooltip>
  );
};

export default NextHalvingInfo;
