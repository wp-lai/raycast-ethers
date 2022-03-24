import { Action, ActionPanel, Form, List, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";

const chains = [
  { value: "homestead", name: "Ethereum Mainnet" },
  { value: "ropsten", name: "Ropsten Testnet" },
  { value: "rinkeby", name: "Rinkeby Testnet" },
  { value: "goerli", name: "Görli Testnet" },
  { value: "kovan", name: "Kovan Testnet" },
  { value: "matic", name: "Polygon" },
  { value: "maticmum", name: "Polygon Mumbai Testnet" },
  { value: "optimism", name: "Optimism" },
  { value: "optimism-kovan", name: "Optimism Testnet" },
  { value: "arbitrum", name: "Arbitrum" },
  { value: "arbitrum-rinkeby", name: "Arbitrum Testnet" },
];

export default function Command() {
  const { push } = useNavigation();

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Query Network Info"
            onSubmit={(values) => push(<NetworkItems network={values.network} />)}
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="network" title="network" defaultValue="ethereum">
        {chains.map((chain, index) => (
          <Form.Dropdown.Item key={index} value={chain.value} title={chain.name} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}

function NetworkItems(props: { network: string }) {
  const [network, setNetwork] = useState<ethers.providers.Network>();
  const [feeData, setFeeData] = useState<ethers.providers.FeeData>();
  const [block, setBlock] = useState<ethers.providers.Block>();

  useEffect(() => {
    async function queryNetworkInfo(network: string) {
      const provider = new ethers.providers.AlchemyProvider(network);
      setNetwork(await provider.getNetwork());
      setFeeData(await provider.getFeeData());
      const blockNumber = provider.getBlockNumber();
      setBlock(await provider.getBlock(blockNumber));
    }
    queryNetworkInfo(props.network);
  }, []);

  return (
    <List isLoading={!network || !feeData || !block}>
      <List.Section title="Network data">
        <Item title="network name" content={network?.name} />
        <Item title="network chainId" content={network?.chainId.toString()} />
      </List.Section>
      <List.Section title="Fee data">
        <Item
          title="gas price"
          content={feeData?.gasPrice?.toString()}
          accessories={feeData && [{ text: formatGas(feeData.gasPrice as BigNumber) }]}
        />
        <Item
          title="maxfee per gas"
          content={feeData?.maxFeePerGas?.toString()}
          accessories={feeData && [{ text: formatGas(feeData.maxFeePerGas as BigNumber) }]}
        />
        <Item
          title="maxPriorityFee per gas"
          content={feeData?.maxPriorityFeePerGas?.toString()}
          accessories={feeData && [{ text: formatGas(feeData.maxPriorityFeePerGas as BigNumber) }]}
        />
      </List.Section>
      <List.Section title="Block data">
        <Item title="block height" content={block?.number.toString()} />
        <Item
          title="block timestamp"
          content={block?.timestamp.toString()}
          accessories={block && [{ text: formatTimestamp(block.timestamp) }]}
        />
      </List.Section>
    </List>
  );
}

function Item(props: { title: string; content: string | undefined; accessories?: List.Item.Accessory[] | undefined }) {
  return (
    <List.Item
      title={props.title}
      subtitle={props.content}
      accessories={props.accessories}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy to Clipboard" content={props.content ?? ""} />
        </ActionPanel>
      }
    />
  );
}

function formatGas(gas: BigNumber) {
  const gasGwei = Number(ethers.utils.formatUnits(gas, "gwei")).toFixed(2);
  return gasGwei + " gwei";
}

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return `${date}`;
}
