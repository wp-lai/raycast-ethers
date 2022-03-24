import { Action, ActionPanel, List } from "@raycast/api";
import { ethers, Wallet } from "ethers";
import { useEffect, useState } from "react";

export default function Command() {
  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    setWallet(ethers.Wallet.createRandom());
  }, []);

  return (
    <List isLoading={!wallet}>
      <Item title="Address" content={wallet?.address} />
      <Item title="PrivateKey" content={wallet?.privateKey} />
      <Item title="Mnemonic" content={wallet?.mnemonic.phrase} />
    </List>
  );
}

function Item(props: { title: string; content: string | undefined}) {
  return (
    <List.Item
      title={props.title}
      subtitle={props.content}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy to Clipboard" content={props.content ?? ""} />
        </ActionPanel>
      }
    />
  );
}
