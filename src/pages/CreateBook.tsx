import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { QueryClient, useMutation } from '@tanstack/react-query'
import { createBook } from '@/http/api'
import { Loader } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

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
    }, "coverImage is required."),
    bookPdf: z.instanceof(FileList).refine((file) => {
        return file.length == 1
    }, "Book Pdf is required."),
})


const CreateBook = () => {

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            genere: '',
            description: '',
        }
    });

    const coverImageRef = form.register('coverImage');
    const bookPdfRef = form.register('bookPdf');

    const queryClient = new QueryClient();

    const mutation = useMutation({
        mutationFn: createBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            navigate('/dashboard/books');
            console.log("Book created Successfully");
        }
    })

    function onsubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("genere", values.genere);
        formData.append("description", values.description);
        formData.append("coverImage", values.coverImage[0]);
        formData.append("file", values.bookPdf[0]);

        mutation.mutate(formData);
    }

    return (
        <section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)} >
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
                                    <BreadcrumbLink >Create</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className='flex items-center gap-3'>
                            <Link to={'/dashboard/books'}>
                                <Button variant={'outline'}>
                                    Cancle
                                </Button>
                            </Link>
                            <Button className='' variant={'default'} disabled={mutation.isPending}>
                                {mutation.isPending ? <Loader className='animate-spin' /> : ''}
                                <span className='ml-2'>Create</span>
                            </Button>
                        </div>
                    </div>

                    <Card className='mt-4'>
                        <CardHeader >
                            <CardTitle>Create a new Book</CardTitle>
                            <CardDescription>
                                Manage your Books and view their sales performance.
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
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>CoverImage</FormLabel>
                                            <FormControl>
                                                <Input {...coverImageRef}
                                                    type="file"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bookPdf"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Book Pdf</FormLabel>
                                            <FormControl>
                                                <Input {...bookPdfRef}
                                                    type="file"
                                                    className="w-full"
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

export default CreateBook

