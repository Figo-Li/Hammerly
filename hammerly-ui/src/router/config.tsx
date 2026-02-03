
import type { RouteObject } from "react-router-dom";
import Home from "../pages/home/page";
import AuctionDetail from "../pages/auction-detail/page";
import Auctions from "../pages/auctions/page";
import Guide from "../pages/guide/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auctions",
    element: <Auctions />,
  },
  {
    path: "/auction/:id",
    element: <AuctionDetail />,
  },
  {
    path: "/guide",
    element: <Guide />,
  },
];

export default routes;
