import { useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { Card, Button, Container, Box, TextField, Flex, Text } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import ClipLoader from "react-spinners/ClipLoader";

export function VerifyCertificate(
{ certificateId }: { certificateId: string}
) {
  const certificatePackageId = useNetworkVariable("certificatePackageId");
  const suiClient = useSuiClient();

  const [localCertificateId, setLocalCertificateId] = useState(certificateId);
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [institudeName, setInstitudeName] = useState("");
  const [issuer, setIssuer] = useState("");

  function verify() {

        let certificate = getCertificateFields(data);
        console.log(localCertificateId);
	setInstitudeName("ABC College");
  }

  const verifyAsync = async () => {
    try {
      let res = await suiClient.getObject({ id: localCertificateId, options: { showContent: true }});
      //console.log(res.data.content);
      let certificate = getCertificateFields(res.data);
      console.log(certificate);
      setInstitudeName("ABC College");
      setStudentName(certificate.student);
      setCourseName(certificate.course);
      setIssuer(certificate.issuer);
    } catch (e) {
      console.log("fetch failed:", e);
    }
  }

  return (
  	<Container>
		<Box maxWidth="800px" height="64px">
			<TextField.Root size="3" value={localCertificateId} onChange={(e) => setLocalCertificateId(e.target.value) } placeholder="key in your certificate id" />
		</Box>
  		<Button
  			size="3"
  			onClick={() => {
  				verifyAsync();
  			}}
  		>
  			{"Verify Certificate"}
  		</Button>
<br/><br/>
                <Card>
                <Container>
                <Text as="label"><strong>{studentName}</strong></Text>
                </Container>
                <Container>
                <Text>{courseName}</Text>
                </Container>
                <Container>
                <Text>{institudeName}</Text>
                </Container>
                <Container>
                <Text>{issuer}</Text>
                </Container>
                </Card>
  	</Container>
  );

function getCertificateFields(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
  	return null;
  }

  return data.content.fields as { issuer: string, student: string; course: string; issue_date: string; document_hash: string };
}
}
