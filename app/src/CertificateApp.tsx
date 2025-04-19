import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";
import { Certificate } from "./Certificate";
import { IssueCertificate } from "./IssueCertificate";
import { VerifyCertificate } from "./VerifyCertificate";

function App() {
  const currentAccount = useCurrentAccount();
  const [certificateId, setCertificateId] = useState("");
  const [counterId, setCounter] = useState(() => {
  	const hash = window.location.hash.slice(1);
  	return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
  	<>
  		<Flex
  			position="sticky"
  			px="4"
  			py="2"
  			justify="between"
  			style={{
  				borderBottom: "1px solid var(--gray-a2)",
  			}}
  		>
  			<Box>
  				<Heading>Sui Certificate dApp</Heading>
  			</Box>

  			<Box>
  				<ConnectButton />
  			</Box>
  		</Flex>
  		<Container>
  			<Container
  				mt="5"
  				pt="2"
  				px="4"
  				style={{ background: "var(--gray-a2)", minHeight: 300 }}
  			>
  				{currentAccount ? (
  					counterId ? (
  						<Counter id={counterId} />
  					) : (
  						<IssueCertificate
  							onIssued={(id) => {
  								setCertificateId(id);
  							}}
  						/>
  					)
  				) : (
  					<Heading>Please connect your wallet</Heading>
  				)}
  			</Container>
  			<Container
  				mt="5"
  				pt="2"
  				px="4"
  				style={{ background: "var(--gray-a2)", minHeight: 300 }}
  			>
  						<VerifyCertificate certificateId={certificateId} />
  			</Container>
  		</Container>
  	</>
  );
}

export default App;
