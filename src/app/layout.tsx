import "./globals.css";

export const metadata = {
	title: "Controle de plantão farmacêutico",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-br">
			<head>
				<link rel="icon" href="/favicon.svg" sizes="any" />
			</head>
			<body>{children}</body>
		</html>
	);
}
