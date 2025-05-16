import { useMediaQuery } from "react-responsive";

function MediaQueries() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1200px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 600px) and (max-width: 1199.98px)",
  });
  const isMobile = useMediaQuery({ query: "(max-width: 599.98px)" });

  return { isDesktop, isTablet, isMobile };
}

export default MediaQueries;
