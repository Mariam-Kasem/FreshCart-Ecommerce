export default function Footer() {
  return (
    <footer className="bg-light border-top py-3 mt-auto">
      <div className="container text-center text-muted small">
        © {new Date().getFullYear()} FreshCart. All rights reserved.
      </div>
    </footer>
  );
}