export default function Header() {
    return (
        <header>
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-full">
                    <a href="/" className="flex items-center">
                        <img src="/full-logo.svg" className="mr-3 h-6 sm:h-9" alt="Dev Portal Logo" />
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Dev Portal</span>
                    </a>
                    <div className="flex items-center lg:order-2">
                    <a href="#" className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Log out</a>
                    </div>
                    <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2"></div>
                </div>
            </nav>
        </header>
    )
  }
  