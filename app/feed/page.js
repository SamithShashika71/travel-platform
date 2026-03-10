"use client";
import { useState, useEffect, useCallback } from "react";
import ListingCard from "@/components/ListingCard";

export default function FeedPage() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchListings = useCallback(async (searchVal, pageVal, append = false) => {
    if (pageVal === 1) setLoading(true); else setLoadingMore(true);
    try {
      const res = await fetch(`/api/listings?search=${searchVal}&page=${pageVal}&limit=9`);
      const data = await res.json();
      setListings((prev) => append ? [...prev, ...data.listings] : data.listings);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchListings(query, 1, false);
    setPage(1);
  }, [query, fetchListings]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchListings(query, next, true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&auto=format&fit=crop"
          alt="feed banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-16">
          <h1 className="text-4xl md:text-6xl font-black text-white text-center mb-6 tracking-tight">
            Explore Experiences
          </h1>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl flex gap-2">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or location..."
                className="w-full bg-white/15 backdrop-blur-md border border-white/25 text-white placeholder-white/50 pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-3 rounded-2xl transition-colors text-sm whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Results info */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500 text-sm">
              {pagination?.total === 0
                ? "No experiences found"
                : `Showing ${listings.length} of ${pagination?.total} experiences`}
              {query && <span className="text-amber-500 font-medium"> for "{query}"</span>}
            </p>
            {query && (
              <button
                onClick={() => { setSearch(""); setQuery(""); }}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🌍</p>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No experiences found</h3>
            <p className="text-gray-400 text-sm">
              {query ? "Try a different search term" : "Be the first to list a travel experience!"}
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && listings.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>

            {/* Load more */}
            {pagination?.hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-white border border-gray-200 hover:border-amber-400 hover:text-amber-500 text-gray-600 font-semibold px-8 py-3 rounded-2xl transition-all text-sm disabled:opacity-50 shadow-sm"
                >
                  {loadingMore ? "Loading..." : "Load More Experiences"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}