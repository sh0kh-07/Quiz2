import { useEffect } from "react"
import { QuestionApi } from "../../utils/Controllers/QuestionApi"
import { useParams } from "react-router-dom"

export default function Theme() {
    const { id } = useParams()
    const telegramUserId = localStorage.getItem('telegramChatId')


    const GetAllQuestion = async () => {
        try {
            const response = await QuestionApi.GetForUser(id, telegramUserId)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        GetAllQuestion()
    }, [])

    return (
        <>

        </>
    )
}