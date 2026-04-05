import { getLocaleOnServer } from '@/i18n/server'
import './styles/globals.css'
import './styles/markdown.scss'
export const metadata = {
 title: 'Ali AlRashed SOC Assistant',
 description: 'AI-Powered Security Operations Center Assistant',
}
const LocaleLayout = async ({
 children,
}: {
 children: React.ReactNode
}) => {
 const locale = await getLocaleOnServer()
 return (
<html lang={locale ?? 'en'} className="h-full">
<head>
<title>Ali AlRashed SOC Assistant</title>
</head>
<body className="h-full">
<div className="overflow-x-auto">
<div className="w-screen h-screen min-w-[300px]">
           {children}
</div>
</div>
</body>
</html>
 )
}
export default LocaleLayout
