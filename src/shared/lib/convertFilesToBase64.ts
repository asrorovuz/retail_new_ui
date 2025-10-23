// export const convertFilesToBase64 = async (files: File[]) => {
//     const readFileAsBase64 = (file: File) =>
//         new Promise<{ name: string; content: string }>((resolve, reject) => {
//             const reader = new FileReader()
//             reader.onload = () => {
//                 const base64 = (reader.result as string).split(',')[1] // faqat content
//                 resolve({ name: file.name, content: base64 })
//             }
//             reader.onerror = reject
//             reader.readAsDataURL(file)
//         })

//     return await Promise.all(files.map(readFileAsBase64))
// }

// export const convertImageObjectsToBase64 = async (images) => {
//     const readFileAsBase64 = (file) =>
//         new Promise<string>((resolve, reject) => {
//             const reader = new FileReader()
//             reader.onload = () => {
//                 const base64 = (reader.result as string).split(',')[1]
//                 resolve(base64)
//             }
//             reader.onerror = reject
//             reader.readAsDataURL(file)
//         })

//     return await Promise.all(
//         images.map(async (img) => ({
//             id: img?.id ?? null,
//             name: img.name,
//             content: await readFileAsBase64(img.file),
//         }))
//     )
// }

export const convertFilesToBase64 = async (files: File[]) => {
    const readFileAsBase64 = (file: File) =>
        new Promise<{ name: string; content: string }>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1] // faqat content
                resolve({ name: file.name, content: base64 })
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })

    return await Promise.all(files.map(readFileAsBase64))
}

type ImageObj = {
    id?: string | number | null
    name?: string
    img?: string | null
    file?: File | null
    fs_url?: string | null
}

export const convertImageObjectsToBase64 = async (images: ImageObj[], imgUrl: string) => {
    const readFileAsBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1]
                resolve(base64)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
        
    return await Promise.all(
        images.map(async (img) => {
            // Yangi rasm yuklangan bo‘lsa (File bor) → Case 1 yoki Case 3
            if (img.file instanceof File) {
                const base64 = await readFileAsBase64(img.file)
                console.log("img", img);
                // Agar img.id mavjud bo‘lsa → Case 1 (eski rasmni update qilamiz)
                if (img?.id) {
                    console.log("tessssssss");
                    
                    return {
                        // id: img.img ? null : img.id,
                        name: img.name ?? img.file.name,
                        content: base64,
                        fs_url: imgUrl, // eski fs_url
                    }
                }

                // Agar id yo‘q bo‘lsa → Case 3 (yangi rasm qo‘shish)
                return {
                    name: img.name ?? img.file.name,
                    content: base64,
                }
            }

            // Agar file yo‘q va rasm serverdan kelgan bo‘lsa → Case 2
            return {
                id: img?.id ?? null,
                name: img.name,
            }
        }),
    )
}
