import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export function Certificate({ id }: { id: string }) {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
  	id,
  	options: {
  		showContent: true,
  		showOwner: true,
  	},
  });

  const [waitingForTxn, setWaitingForTxn] = useState("");

  const executeMoveCall = (method: "verify") => {
  	setWaitingForTxn(method);

  	const tx = new Transaction();

  	if (method === "reset") {
  		tx.moveCall({
  			arguments: [tx.object(id), tx.pure.u64(0)],
  			target: `${counterPackageId}::counter::set_value`,
  		});
  	} else {
  		tx.moveCall({
  			arguments: [tx.object(id)],
  			target: `${counterPackageId}::counter::increment`,
  		});
  	}

  	signAndExecute(
  		{
  			transaction: tx,
  		},
  		{
  			onSuccess: (tx) => {
  				suiClient.waitForTransaction({ digest: tx.digest }).then(async () => {
  					await refetch();
  					setWaitingForTxn("");
  				});
  			},
  		},
  	);
  };

  if (isPending) return <Text>Loading...</Text>;

  if (error) return <Text>Error: {error.message}</Text>;

  if (!data.data) return <Text>Not found</Text>;

  const ownedByCurrentAccount =
  	getCertificateFields(data.data)?.owner === currentAccount?.address;

  return (
  	<>
  		<Heading size="3">Certificate {id}</Heading>

  		<Flex direction="column" gap="2">
  			<Text>Issuer: {getCertificateFields(data.data)?.issuer}</Text>
  			<Flex direction="row" gap="2">
  				<Button
  					onClick={() => executeMoveCall("verify")}
  					disabled={waitingForTxn !== ""}
  				>
  					{waitingForTxn === "verify" ? (
  						<ClipLoader size={20} />
  					) : (
  						"Verify"
  					)}
  				</Button>
  			</Flex>
  		</Flex>
  	</>
  );
}
function getCertificateFields(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
  	return null;
  }

  return data.content.fields as { issuer: string, student: string; course: string; issue_date: string; document_hash: string };
}
