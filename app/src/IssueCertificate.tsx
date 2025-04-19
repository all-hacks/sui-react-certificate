import { Transaction } from "@mysten/sui/transactions";
import { Button, Container } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";

export function IssueCertificate({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const certificatePackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const {
  	mutate: signAndExecute,
  	isSuccess,
  	isPending,
  } = useSignAndExecuteTransaction();

  function issue() {
  	const tx = new Transaction();

  	tx.moveCall({
  		arguments: [],
  		target: `${certificatePackageId}::certificate::issue_certificate`,
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

  				onIssued(effects?.created?.[0]?.reference?.objectId!);
  			},
  		},
  	);
  }

  return (
  	<Container>
  		<Button
  			size="3"
  			onClick={() => {
  				issue();
  			}}
  			disabled={isSuccess || isPending}
  		>
  			{isSuccess || isPending ? <ClipLoader size={20} /> : "Issue Certificate"}
  		</Button>
  	</Container>
  );
}
