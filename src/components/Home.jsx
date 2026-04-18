export default function Home() {
  return (
    <div className="bg-blue-50 px-4 py-8">
      <div className="mx-auto px-4 py-8 max-w-3xl bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center ">Home</h1>
        <p> Na těchto stránkách si zkouším, co umím a co neumím.</p>

        <p>Moc nefotím. Našla jsem fotky kytiček, které jsem potkala. 
          Platí, že nejkrásnější květina je brambora, ale tu zrovna vyfocenou nemám. 
          Pod záložkou "Fotky" si můžete tyto fotky prohlédnout. 
          Když na fotku kliknete, zobrazí se vám v detailu a pod ní budou komentáře.
          Komentáře můžete přidávat pouze pokud jste přihlášeni.
        </p>
        <p>Pod záložkou "Piškvorky" si můžete zahrát hru Piškvorky. Pokud jste ze staré školy, 
          jako já, tak si ještě pamatujete jak se to hrálo. Hrají dva hráči. Jeden má znak X, druhý má znak O.
          Každý hráč se snaží umístit pět svých znaků za sebou, horizontálně, vertikálně nebo diagonálně.
          Vyhrává ten, komu se to podaří dřív.</p>
      </div>
    </div>
  );
}