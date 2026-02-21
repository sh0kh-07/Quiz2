import { Button } from "@material-tailwind/react";
import { Download } from "lucide-react";
import { apiTopic } from "../../../utils/Controllers/Topic";
import { Alert } from "../../../utils/Alert";

export default function ExelDownload({ id }) {



    const DownloadExel = async () => {
        try {
            const response = await apiTopic.ExelDownload(id,)
            Alert("Muvaffaqiyatli", "success")
        } catch (error) {
            console.log(error)
            Alert(`Xato: ${error?.message}`, "error")
        }
    }

    return (
        <>
            <Button onClick={DownloadExel} className="p-[10px] flex items-center justify-center w-full"
            >
                <Download className={'w-4 h-4'} />
            </Button>
        </>
    )
}