import Acharuli from "../assets/acharuli-removebg-preview.png"
export default function Hero() {
    return (
        <main className="bg-[#140d08] text-white mt-16">
            <div className="mx-auto max-w-6xl flex">
                <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
                    <div className=" gap-10 md:grid-cols-2 md:items-center">
                        <div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white">
                                <span className=" h-2 w-2 rounded-full bg-orange-400" />
                                Romantic Dining • Fresh daily
                            </div>

                            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                                Traditional Flavors.
                                <span className="text-orange-400" > Shegergos.</span>
                            </h2>

                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
                                Craving something truly special? A traditional Georgian delight that will transport your taste buds straight to Tbilisi!
                            </p>

                            <div className="mt-3 flex gap-2">
                                <a
                                    href="#order"
                                    className="rounded-lg bg-orange-400 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white   hover:text-black transition-all duration-200  ">
                                    Order Now
                                </a>

                                <a
                                    href="#menu"
                                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10">
                                    View Menu
                                </a>
                            </div>


                        </div>
                    </div>
                </section>

                <section className="mt-10">
                    <img src={Acharuli} className="mx-auto mt-5 w-full h-auto cursor-pointer transition-transform duration-200 hover:scale-102" />
                </section>
            </div>
        </main>

    );
}