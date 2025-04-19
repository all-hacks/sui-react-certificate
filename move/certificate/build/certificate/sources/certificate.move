module certificate::certificate {
    use std::string;

    public struct Certificate has key, store {
        id: object::UID,
        issuer: address,
        student: string::String,
        course: string::String,
        issue_date: u64,
        document_hash: vector<u8>,
    }

    public fun issue_certificate(
        student: string::String,
        course: string::String,
        issue_date: u64,
        document_hash: vector<u8>,
        ctx: &mut tx_context::TxContext
    ): Certificate {
        Certificate {
            id: object::new(ctx),
            issuer: tx_context::sender(ctx),
            student,
            course,
            issue_date,
            document_hash,
        }
    }

    public fun transfer_certificate(
        certificate: Certificate,
        recipient: address
    ) {
        transfer::transfer(certificate, recipient);
    }
}

