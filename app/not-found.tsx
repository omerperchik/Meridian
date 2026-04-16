import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <div className="container-narrow py-24 text-center">
      <div className="eyebrow mb-3">404</div>
      <h1 className="text-4xl font-semibold mb-3">Off the prime meridian.</h1>
      <p className="text-text-secondary mb-8">That page is not on file. If you think this is an error, let us know.</p>
      <div className="flex items-center justify-center gap-3">
        <Button href="/">Home</Button>
        <Button href="/search" variant="secondary">
          <Icon name="search" size={13} /> Search
        </Button>
        <Button href="/contact" variant="ghost">
          Report
        </Button>
      </div>
    </div>
  );
}
