import { useState, type ReactNode } from "react";

interface AccordionItem {
    id: string;
    titulo: ReactNode;
    conteudo: ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    defaultExpanded?: string[];
}

export const Accordion = ({ items, defaultExpanded = [] }: AccordionProps) => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className="d-flex flex-column gap-1">
            {items.map((item) => {
                const aberto = expanded.has(item.id);
                return (
                    <div key={item.id}>
                        <div
                            role="button"
                            tabIndex={0}
                            className="d-flex align-items-center gap-2 px-2 py-2 rounded"
                            style={{
                                cursor: "pointer",
                                backgroundColor: aberto ? "#2a2d33" : "transparent",
                            }}
                            onClick={() => toggle(item.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") toggle(item.id);
                            }}
                        >
                            {item.titulo}
                        </div>

                        {aberto && (
                            <div className="d-flex flex-column gap-1 ps-3 mt-1 mb-1">
                                {item.conteudo}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
