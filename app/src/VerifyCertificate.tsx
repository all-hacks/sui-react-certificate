import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, Box, TextField, Flex } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";

export function VerifyCertificate({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const {
  	mutate: signAndExecute,
  	isSuccess,
  	isPending,
  } = useSignAndExecuteTransaction();

  function create() {
  	const tx = new Transaction();

  	tx.moveCall({
  		arguments: [],
  		target: `${counterPackageId}::counter::create`,
  	});

  	signAndExecute(
  		{
  			transaction: tx,
  		},
  		{
  			onSuccess: async ({ digest }) => {
  				const { effects } = await suiClient.waitForTransaction({
  					digest: digest,
  					options: {
  						showEffects: true,
  					},
  				});

  				onCreated(effects?.created?.[0]?.reference?.objectId!);
  			},
  		},
  	);
  }

  return (
  	<Container>
		<Box maxWidth="500px" height="64px">
			<TextField.Root size="3" placeholder="key in your document id" />
		</Box>
  		<Button
  			size="3"
  			onClick={() => {
  				create();
  			}}
  			disabled={isSuccess || isPending}
  		>
  			{isSuccess || isPending ? <ClipLoader size={20} /> : "Verify Certificate"}
  		</Button>
  	</Container>
  );
}
