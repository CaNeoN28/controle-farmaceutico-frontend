import FetchAutenticacao from "@/fetch/autenticacao";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function redirecionarAutenticacao() {
	const router = useRouter();
	const token = getCookie("authentication");

	if (!token) {
		router.push("/login");

		return;
	}

	const fAuth = new FetchAutenticacao().getPerfil;

	fAuth(token)
		.then()
		.catch(() => {
			deleteCookie("authentication")
			router.push("/login");
		});
}
