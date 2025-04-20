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

  //let hash;
  //const docText = [ studentName, courseName].join('|');
  //const hash = async () => { await hashDocument(docText) };
  //hashDocument(docText).then((d) => hash = d);
  //console.log(hash, docText);

  const [documentHash, setDocumentHash] = useState("0xdf540b72fb081e3e94558c1817418");

  const account = useCurrentAccount();

  async function hashDocument(input) {
  const encoded = new TextEncoder().encode(input);
  const buffer = await window.crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function issue() {

  	const tx = new Transaction();
        console.log({certificatePackageId});

  	let cert = tx.moveCall({
//  		arguments: [tx.pure.string(studentName), tx.pure.string(courseName), tx.pure.u64(0), tx.pure.vector('u8',[1,244,6,7])],
  		arguments: [tx.pure.string(studentName), tx.pure.string(courseName), tx.pure.u64(0), tx.pure.vector('u8',new TextEncoder().encode(documentHash.substring(2)))],
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
