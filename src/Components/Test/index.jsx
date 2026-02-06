import { useEffect, useState } from "react"
import { QuestionApi } from "../../utils/Controllers/QuestionApi"
import { useParams } from "react-router-dom"

export default function Test() {
    const { id } = useParams()

    const GetAllQuiz = async () => {
        try {
            const response = await QuestionApi.GetAll(id)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        GetAllQuiz()
    }, [])

    return (
        <>

        </>
    )
}