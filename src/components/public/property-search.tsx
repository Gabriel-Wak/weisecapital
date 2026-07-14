"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function PropertySearch() {
  const router = useRouter();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    neighborhood: "",
    type: "",
    purpose: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  });

  function handleSearch() {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/imoveis?${params.toString()}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      <Card className="mx-auto max-w-4xl border-0 bg-background/80 p-6 shadow-2xl backdrop-blur-xl">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Cidade ou bairro"
              value={filters.city}
              onChange={(e) =>
                setFilters({ ...filters, city: e.target.value })
              }
              className="h-12"
            />
          </div>
          <Select
            value={filters.purpose}
            onValueChange={(v) => setFilters({ ...filters, purpose: v ?? "" })}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Finalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SALE">Comprar</SelectItem>
              <SelectItem value="RENT">Alugar</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.type}
            onValueChange={(v) => setFilters({ ...filters, type: v ?? "" })}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="APARTMENT">Apartamento</SelectItem>
              <SelectItem value="HOUSE">Casa</SelectItem>
              <SelectItem value="PENTHOUSE">Cobertura</SelectItem>
              <SelectItem value="LOFT">Loft</SelectItem>
              <SelectItem value="COMMERCIAL">Comercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 grid gap-4 border-t pt-4 md:grid-cols-4"
          >
            <Input
              placeholder="Preço mínimo"
              type="number"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
            />
            <Input
              placeholder="Preço máximo"
              type="number"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />
            <Select
              value={filters.bedrooms}
              onValueChange={(v) => setFilters({ ...filters, bedrooms: v ?? "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Dormitórios" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}+ dormitórios
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Bairro"
              value={filters.neighborhood}
              onChange={(e) =>
                setFilters({ ...filters, neighborhood: e.target.value })
              }
            />
          </motion.div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Busca Avançada
          </Button>
          <Button size="lg" onClick={handleSearch} className="px-8">
            <Search className="mr-2 h-4 w-4" />
            Buscar Imóveis
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
