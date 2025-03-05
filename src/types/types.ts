export type NotionPageProperties = {
    Nama: {
        title: {
            text: {
                content: string;
            };
        }[];
    };
    "No HP": {
        phone_number: string;
    };
    "Status CG": {
        status: {
            name: string;
        };
    };
    Alamat: {
        rich_text: {
            text: {
                content: string;
            };
        }[];
    };
    "Tanggal Lahir": {
        date: {
            start: string;
        } | null;
    };
    Register: {
        checkbox: boolean;
    };
    ReRegister?: {
        checkbox: boolean;
    }
    CG?: {
        select: {
            name: string;
        };
    };
    Universitas?: {
        select: {
            id: string;
        };
    };
};
