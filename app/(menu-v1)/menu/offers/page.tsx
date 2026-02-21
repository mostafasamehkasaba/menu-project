"use client";

import { useEffect, useState } from "react";
import { Cairo } from "next/font/google";
import { formatCurrency, getLocalizedText } from "../../../lib/i18n";
import { useLanguage } from "../../../components/language-provider";
import { fetchMenuCatalog } from "../../../services/menu-api";
import type { OfferItem } from "../../../lib/menu-data";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export default function OffersPage() {
  const { dir, lang, t } = useLanguage();
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadOffers = async () => {
      const data = await fetchMenuCatalog();
      if (!mounted) {
        return;
      }
      setOffers(data?.offers ?? []);
      setIsLoading(false);
    };

    loadOffers();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      <div className="px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-6xl rounded-[28px] bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 px-6 py-6 text-white shadow-[0_20px_40px_rgba(234,106,54,0.25)]">
          <h1 className="text-lg font-semibold sm:text-xl">
            {t("todaysOffers")}
          </h1>
          <p className="mt-2 text-xs text-orange-100 sm:text-sm">
            {t("saveMoreWithSpecialOffers")}
          </p>
        </header>

        <section className="mx-auto mt-8 max-w-6xl">
          {isLoading ? (
            <div className="rounded-3xl bg-white p-6 text-center text-sm text-slate-500 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
              Loading...
            </div>
          ) : offers.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 text-center text-sm text-slate-500 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
              <h3 className="text-base font-semibold text-slate-800">
                {t("emptyMenuTitle")}
              </h3>
              <p className="mt-2">{t("emptyMenuMessage")}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer) => (
                <article
                  key={offer.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative">
                    <img
                      src={offer.image}
                      alt={getLocalizedText(offer.title, lang)}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                    {offer.badge && (
                      <span className="absolute right-4 top-4 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white">
                        {offer.badge}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 px-5 pb-5 pt-4 text-sm">
                    <h3 className="text-base font-semibold">
                      {getLocalizedText(offer.title, lang)}
                    </h3>
                    <p className="text-slate-500">
                      {getLocalizedText(offer.desc, lang)}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-orange-500">
                        {formatCurrency(offer.price, lang)}
                      </span>
                      {offer.oldPrice ? (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(offer.oldPrice, lang)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

