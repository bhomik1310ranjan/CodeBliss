import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSigninMutation } from "../redux/api";
import { useAppDispatch } from "../redux/app/hooks";
import { signin as signinReducer } from "../redux/slices/authSlice";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { ApiError } from "../types/api";

function Signin() {
    const signinSchema = z.object({
        identifier: z
            .string()
            .refine((identifier) => identifier.trim() !== "", {
                message: "Please provide your username or email address.",
            }),
        password: z.string().refine((password) => password.trim() !== "", {
            message: "Please provide your password.",
        }),
    });

    const signinForm = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const [signin, { isLoading }] = useSigninMutation();

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const location = useLocation();

    const from = location.state?.from?.pathname || "/projects";

    const handleSignin = async (
        userCredentials: z.infer<typeof signinSchema>
    ) => {
        try {
            const response = await signin(userCredentials).unwrap();
            dispatch(signinReducer(response.user));
            toast(response.message);
            navigate(from, { replace: true });
        } catch (error) {
            const errorResponse = error as { status: number; data: ApiError };
            toast(
                errorResponse.data?.message ||
                    "We have encountered an issue. Please try again soon."
            );
            if (errorResponse.data?.errors) {
                errorResponse.data.errors.map(({ field, error }) =>
                    signinForm.setError(
                        field as keyof typeof signinSchema.shape,
                        {
                            type: "custom",
                            message: error,
                        }
                    )
                );
            }
        }
    };

    return (
        <div
            className={`w-11/12 max-w-7xl min-h-[calc(100vh-68px)] mx-auto flex justify-center items-center pt-4 pb-6`}
        >
            <div className="w-full sm:w-4/5 md:w-3/5 lg:w-9/20 flex flex-col gap-y-2 xsm:gap-y-3 border rounded-lg p-2.5 xsm:p-3.5 sm:p-5">
                <div className="font-medium text-2xl text-primary tracking-wider">
                    Sign in 👋
                </div>
                <div className="text-sm opacity-80">
                    Welcome back to CodeBliss! Continue crafting your frontend
                    masterpieces.
                </div>
                <Form {...signinForm}>
                    <form
                        onSubmit={signinForm.handleSubmit(handleSignin)}
                        className="flex flex-col gap-y-1.5 xsm:gap-y-2.5"
                    >
                        <FormField
                            control={signinForm.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your username or email address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signinForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <div className="flex items-center gap-x-2">
                                    <LoaderCircle
                                        size={20}
                                        className="animate-spin"
                                    />
                                    <div>Signing in</div>
                                </div>
                            ) : (
                                <div>Sign in</div>
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="flex items-center gap-x-1 mx-auto text-xs xsm:text-sm">
                    <div>New to CodeBliss?</div>
                    <Link
                        to="/signup"
                        state={{ from: location.state?.from }}
                        className="text-primary"
                    >
                        Sign up
                    </Link>
                    <div>now</div>
                </div>
            </div>
        </div>
    );
}

export default Signin;
