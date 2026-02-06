import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Calendar, Clock, FileText } from "lucide-react";

export default function Info({ data }) {
    if (!data) return null;

    return (
        <Card className="w-full shadow-lg border border-gray-200 rounded-xl">
            <CardBody className="flex flex-wrap justify-between items-center gap-6 md:gap-10">
                {/* Название */}
                <div className="flex items-center gap-2 min-w-[150px]">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <Typography variant="h6" className="text-gray-800 truncate">
                        {data.name || "—"}
                    </Typography>
                </div>

                {/* Время */}
                <div className="flex items-center gap-1 min-w-[120px]">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 text-sm">{data.time} daqiqa</span>
                </div>

                {/* Кол-во вопросов */}
                <div className="flex items-center gap-1 min-w-[120px]">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 text-sm">{data.count} savol</span>
                </div>

                {/* Дата создания */}
                <div className="flex items-center gap-1 min-w-[160px]">
                    <span className="font-medium text-gray-500">Yaratilgan:</span>
                    <span className="text-gray-600 text-sm">
                        {new Date(data.createdAt).toLocaleDateString("uz-UZ")}
                    </span>
                </div>
            </CardBody>
        </Card>
    );
}
