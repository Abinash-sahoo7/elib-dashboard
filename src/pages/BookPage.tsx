import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteBook, getBooks } from '@/http/api';
import { Book } from '@/types';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { CirclePlus, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const BookPage = () => {
  const queryClient = new QueryClient();
  var BookId: string;
  // var delete: any;
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
    staleTime: 10000,  // milliseconds
    refetchOnMount: true,
    refetchOnWindowFocus: true
    // enabled: false
  });

  console.log('data', data);

  const mutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      console.log("Book Deleted Successfully");
      // nav('/dashboard/Books');
    }
  })

  const HandleDeleteBook = (event: any) => {
    BookId = event.target.id;
    // console.log("Delete Successfully", BookId);
    mutation.mutate(BookId);
    setSelectedBookId(null);
    // <BookPage />
  }

  useEffect(() => {
    // <BookPage />
  }, [selectedBookId])

  return (
    <div>
      <div className='flex items-center justify-between'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Books</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link to={'/dashboard/books/create'}>
          <Button className='flex items-center gap-2' variant={'default'}>
            <CirclePlus size={20} />
            <span>Add Books</span>
          </Button>
        </Link>
      </div>

      <Card className='mt-6'>
        <CardHeader>
          <CardTitle>Books</CardTitle>
          <CardDescription>
            Manage your Books and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Genere</TableHead>
                <TableHead className="hidden md:table-cell">
                  Auther Name
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                data?.data &&
                data?.data.books.map((book: Book) => {
                  return (
                    <TableRow key={book._id}>
                      <TableCell className="hidden sm:table-cell">
                        <img
                          alt={book.title}
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={book.coverImage}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {book.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{book.genere}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {book.author.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {book.createdAt}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Link to={`/dashboard/books/update/${book._id}`}>
                              <DropdownMenuItem>
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            <AlertDialog >
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" className='' >Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure for Delete?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    Book and remove your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={HandleDeleteBook} id={book._id}>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>)
                })
              }

            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong>{" "}
            products
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}

export default BookPage