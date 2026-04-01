import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { useLogin } from "@/hooks/useLogin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export function LoginForm() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(login.mutate)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="username"
            type="email"
            placeholder="correo@ejemplo.com"
            className="pl-10"
            {...register("username")}
            aria-invalid={!!errors.username}
          />
        </div>
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={login.isPending}
      >
        {login.isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>
    </form>
  );
}