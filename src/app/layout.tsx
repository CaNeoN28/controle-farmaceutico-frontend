import "./globals.css";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" sizes="any" />
				<title>Controle de plantão farmacêutico</title>
			</head>
			<body>{children}</body>
		</html>
	);
}
