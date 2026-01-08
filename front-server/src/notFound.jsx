export default function NotFound() {
  return (
    <div className="w-full h-full z-0 relative">
      <div className="absolute w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold text-orange-700">404</h1>
      <p className="text-center text-lg">Cette page n'existe pas</p>
      <div className="flex flex-wrap w-2/3 justify-around mt-20">
      <a href="/" className="bg-gray-400 text-white  px-3 py-2 rounded-xl hover:bg-gray-500 font-bold shadow-xl">Retourner à l'accueil</a>
      <a href="https://www.numdiag.fr" className="bg-gray-400 text-white px-3 py-2 rounded-xl hover:bg-gray-500 font-bold shadow-xl">Aller à NumDiag.fr</a>
      </div>
      </div>
      <img src="/images/404_planet.svg" alt="" className="w-full h-full z-10"/>
    </div>
  )
}
