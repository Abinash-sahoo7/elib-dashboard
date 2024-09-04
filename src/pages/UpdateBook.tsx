import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { getSingleBook, updateBook } from "@/http/api"
import { Loader } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'title must be have at least 2 characters.'
    }),
    genere: z.string().min(2, {
        message: 'genere must be have at least 2 characters.'
    }),
    description: z.string().min(2, {
        message: 'description must be have at least 2 characters.'
    }),
    coverImage: z.instanceof(FileList).refine((file) => {
        return file.length == 1
    }, "CoverImage is required."),
    bookPdf: z.instanceof(FileList).refine((file) => {
        return file.length == 1
    }, "Book Pdf is required."),
})


const UpdateBook = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = new QueryClient();

    const [book, setBook] = useState({});
    const [coverImage, setCoverImage] = useState('');
    const [bookPdf, setBookPdf] = useState('');
    const params = useParams();
    const BookId = params.BookId;

    useEffect(() => {
        if (!BookId) {
            navigate('/dashboard/books');
        }
    }, [BookId, navigate])

    const { data, isError, isLoading, error } = useQuery({
        queryKey: ['singleBook'],
        queryFn: () => getSingleBook(BookId!),
        staleTime: 1000,
        enabled: !!BookId
    });
    // console.log(data);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            genere: '',
            description: '',
            coverImage: undefined,
            bookPdf: undefined
        }
    });

    useEffect(() => {
        if (data) {
            form.setValue('title', data.title);
            form.setValue('genere', data.genere);
            form.setValue('description', data.description);
            form.setValue('coverImage', data.coverImage);
            form.setValue('bookPdf', data.file);
            setCoverImage(data.coverImage);
            setBookPdf(data.file)
        }
    }, [data, form]);

    if (!BookId) {
        return null;
    }

    const mutation = useMutation({
        mutationFn: updateBook,
        onSuccess: (response) => {
            console.log(response);
            console.log(response.data.title);
            toast({
                title: " Book Update SuccessFully",
                description: `Book - ${response.data.title} successfully Updated`,
                action: <Link to={`/dashboard/books/update/${response.data._id}`}> <ToastAction altText="Try again">View</ToastAction></Link>,
            })
            queryClient.invalidateQueries({ queryKey: ['books'] })
            console.log("Book Updated Successfully");
            navigate('/dashboard/books');
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("genere", values.genere);
        formData.append("description", values.description);
        formData.append("coverImage", values.coverImage[0]);
        formData.append("file", values.bookPdf[0]);
        formData.append("BookId", BookId!);
        console.log(formData);
        mutation.mutate(formData);
    }


    return (
        <section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} >
                    <div className='flex items-center justify-between'>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard/books">Books</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink >{BookId}</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className='flex items-center gap-3'>
                            <Link to={'/dashboard/books'}>
                                <Button variant={'outline'}>
                                    Cancle
                                </Button>
                            </Link>
                            <Button className='' variant={'default'} disabled={mutation.isPending}
                            // onClick={() => {
                            //     toast({
                            //         title: "Update SuccessFully",
                            //         description: `Book - ${data.title} successfully Updated`,
                            //         action: <ToastAction altText="Try again">View Book</ToastAction>,
                            //     })
                            // }}
                            >
                                {mutation.isPending && <Loader className="animate-spin" />}
                                <span className='ml-2'>Update</span>
                            </Button>
                        </div>
                    </div>

                    <Card className='mt-4'>
                        <CardHeader >
                            <CardTitle>Update Book</CardTitle>
                            <CardDescription>
                                Manage your Books and view their sales performance.<br />
                                <span className="text-red-700">{isError && `Error : ${error.message}`}</span>
                                <span className="text-red-700">{mutation.isError && `Error : ${mutation.error}`}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    id="title"
                                                    type="text"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="genere"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Genere</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    id="genere"
                                                    type="text"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea className='min-h-20' {...field} id='description' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="coverImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CoverImage {coverImage && <a target="_blank" className="ml-10" href={coverImage}>View CoverImage</a>}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    className="w-full"
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        form.setValue('coverImage', files!);
                                                    }}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bookPdf"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Book Pdf {bookPdf && <a target="_blank" className="ml-10" href={bookPdf}>View File</a>}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    className="w-full"
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        form.setValue('bookPdf', files!);
                                                    }}
                                                    ref={field.ref}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </section>
    )
}

export default UpdateBook