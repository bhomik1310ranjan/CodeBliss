import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import { Link, useNavigate } from "react-router-dom";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify } from "lucide-react";
import { useEffect, useState } from "react";
import { useSignoutMutation } from "../redux/api";
import { toast } from "sonner";
import { signout as signoutReducer } from "../redux/slices/authSlice";
import { ApiError } from "../types/api";

function Header() {
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setSheetOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isAuthenticated = useAppSelector(
        (state) => state.auth.isAuthenticated
    );

    const [signout, { isLoading }] = useSignoutMutation();

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            const response = await signout().unwrap();
            dispatch(signoutReducer());
            toast(response.message);
            navigate("/signin");
        } catch (error) {
            const errorResponse = error as { status: number; data: ApiError };
            if (errorResponse.status === 401) {
                dispatch(signoutReducer());
                toast(
                    errorResponse.data.message ||
                        "Your sign in session has expired. Please sign in again."
                );
                navigate("/signin");
            }
            toast(
                errorResponse.data?.message ||
                    "We have encountered an issue. Please try again soon."
            );
        }
    };

    return (
        <div className="w-11/12 max-w-7xl mx-auto flex justify-between items-center py-4">
            <Link
                to="/"
                className="font-medium text-xl tracking-wider flex items-center gap-x-1"
            >
                <div className="font-semibold text-2xl">{`</>`}</div>
                <div>
                    <span className="text-primary">Code</span>
                    <span>Bliss</span>
                </div>
            </Link>
            <div className="hidden sm:flex items-center gap-x-2">
                {isAuthenticated ? (
                    <>
                        <Link to="/projects">
                            <Button>My projects</Button>
                        </Link>
                        <Button
                            variant="destructive"
                            onClick={handleSignout}
                            disabled={isLoading}
                        >
                            Sign out
                        </Button>
                    </>
                ) : (
                    <>
                        <Link to="/signin">
                            <Button variant="outline">Sign in</Button>
                        </Link>
                        <Link to="/signup">
                            <Button>Sign up</Button>
                        </Link>
                    </>
                )}
                <ModeToggle />
            </div>
            <div className="flex sm:hidden items-center gap-x-2">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline">
                            <AlignJustify />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle asChild>
                                <div className="flex items-center gap-x-1 tracking-wider mx-auto">
                                    <div className="font-bold text-2xl">{`</>`}</div>
                                    <div className="text-xl mt-0.5">
                                        <span className="text-primary">
                                            Code
                                        </span>
                                        <span>Bliss</span>
                                    </div>
                                </div>
                            </SheetTitle>
                            <SheetDescription>
                                CodeBliss is an online compiler that allows
                                users to write, compile and share HTML, CSS and
                                JavaScript code seamlessly.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-col gap-y-3 my-4">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/projects">
                                        <Button
                                            onClick={() => setSheetOpen(false)}
                                            className="w-full"
                                        >
                                            My projects
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            handleSignout();
                                            setSheetOpen(false);
                                        }}
                                        disabled={isLoading}
                                    >
                                        Sign out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/signin">
                                        <Button
                                            variant="outline"
                                            onClick={() => setSheetOpen(false)}
                                            className="w-full"
                                        >
                                            Sign in
                                        </Button>
                                    </Link>
                                    <Link to="/signup">
                                        <Button
                                            onClick={() => setSheetOpen(false)}
                                            className="w-full"
                                        >
                                            Sign up
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
                <ModeToggle />
            </div>
        </div>
    );
}

export default Header;
