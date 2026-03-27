import { useState } from "react";

export const useReviewForm = (initialData?: { rating: number; title: string; reviewText: string }) => {

    const [formRating, setFormRating] = useState(initialData?.rating ?? 5);
    const [formTitle, setFormTitle] = useState(initialData?.title ?? "");
    const [formText, setFormText] = useState(initialData?.reviewText ?? "");

    return {
        formRating,
        formTitle,
        formText,
        setFormRating,
        setFormTitle,
        setFormText
    };
};