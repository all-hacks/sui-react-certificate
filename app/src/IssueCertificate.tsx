import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, Box, TextField, Flex } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";

export function IssueCertificate({
  onIssued,
}: {
  onIssued: (id: string) => void;
}) {
  const certificatePackageId = useNetworkVariable("certificatePackageId");
  const suiClient = useSuiClient();
  const {
  	mutate: signAndExecute,
  	isSuccess,
  	isPending,
  } = useSignAndExecuteTransaction();

  const [studentName, setStudentName] = useState("alvis chin");
  const [courseName, setCourseName] = useState("business maanagement");
  const [documentHash, setDocumentHash] = useState("0x1234567890abcdef");

  const account = useCurrentAccount();

  function issue() {

  	const tx = new Transaction();
        console.log({certificatePackageId});

  	let cert = tx.moveCall({
  		arguments: [tx.pure.string(studentName), tx.pure.string(courseName), tx.pure.u64(0), tx.pure.vector('u8',[1,244,6,7])],
  		target: `${certificatePackageId}::certificate::issue_certificate`,
  	});

	tx.transferObjects([cert], tx.pure.address(account.address));

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
//console.log(isSuccess, isPending, digest, effects);
  				onIssued(effects?.created?.[0]?.reference?.objectId!);
  			},
                        onError: (e) => console.log(e)
  		},
  	);

  }

  return (
  	<Container>
		<Box maxWidth="500px" height="64px">
			<TextField.Root size="3" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="key in student name" />
		</Box>
		<Box maxWidth="500px" height="64px">
			<TextField.Root size="3" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="key in course name" />
		</Box>
		<Box maxWidth="500px" height="64px">
			<TextField.Root size="3" value={documentHash} onChange={(e) => setDocumentHash(e.target.value)} placeholder="key in document hash" />
		</Box>
  		<Button
  			size="3"
  			onClick={() => {
  				issue();
  			}}
  			
  		>
  			{ "Issue Certificate"}
  		</Button>
  	</Container>
  );
}
