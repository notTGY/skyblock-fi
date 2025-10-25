import { NavHeader } from "@/components/nav-header"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <NavHeader />
      <main className="container mx-auto p-4 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-primary">Hypixel Skyblock Finance</h1>
          <p className="text-xs text-muted-foreground">Real-time bazaar analytics and market intelligence platform</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <h2 className="text-sm font-semibold mb-3 text-accent">Market Fundamentals</h2>
            <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bazaar markets operate on continuous order
                matching systems where buy and sell orders are executed based on price-time priority. Understanding
                order book dynamics is crucial for profitable trading.
              </p>
              <p>
                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Market
                makers provide liquidity by placing both buy and sell orders, earning the spread between bid and ask
                prices while managing inventory risk.
              </p>
              <p>
                Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Price discovery occurs
                through the aggregation of all market participants' information and expectations, reflected in real-time
                order flow.
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-semibold mb-3 text-accent">Virtual vs Real Markets</h2>
            <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
              <p>
                Donec eu libero sit amet quam egestas semper. Unlike real-world markets, Skyblock bazaar operates
                without regulatory oversight, clearing houses, or settlement delays. Transactions are instantaneous and
                irreversible.
              </p>
              <p>
                Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Virtual economies lack central bank
                intervention, meaning no quantitative easing, interest rate adjustments, or lender of last resort
                mechanisms exist to stabilize markets.
              </p>
              <p>
                Quisque sit amet est et sapien ullamcorper pharetra. Supply is determined purely by player activity and
                game mechanics rather than production costs, labor, or resource scarcity. Demand follows different
                patterns driven by game updates and meta shifts.
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-semibold mb-3 text-accent">Order Types & Execution</h2>
            <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
              <p>
                Vivamus vestibulum ntulla nec ante. The bazaar supports instant buy/sell orders (market orders) and
                limit orders. Market orders execute immediately at the best available price, while limit orders wait in
                the order book until filled.
              </p>
              <p>
                Morbi in sem quis dui placerat ornare. Slippage occurs when large market orders consume multiple price
                levels in the order book. Understanding order book depth prevents unexpected execution prices on large
                trades.
              </p>
              <p>
                Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Order priority follows strict
                price-time rules: better prices execute first, and among equal prices, earlier orders have priority.
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-semibold mb-3 text-accent">Risk Management</h2>
            <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
              <p>
                Sed adipiscing ornare risus. Morbi est est, blandit sit amet, sagittis vel, euismod vel, velit. Position
                sizing and diversification remain critical despite the virtual nature of assets. Concentration risk can
                lead to significant losses during market volatility.
              </p>
              <p>
                Mauris turpis nunc, blandit et, volutpat molestie, porta ut, ligula. Volatility patterns differ from
                traditional markets due to game mechanics, updates, and player behavior. Historical volatility analysis
                helps predict future price movements.
              </p>
              <p>
                Fusce pharetra convallis urna. Stop-loss strategies must account for the absence of after-hours trading
                and the continuous nature of the bazaar. Liquidity risk increases during off-peak hours when fewer
                players are active.
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-4 mt-4">
          <h2 className="text-sm font-semibold mb-3 text-accent">Technical Analysis in Virtual Economies</h2>
          <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            <p>
              Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
              Traditional technical indicators like moving averages, RSI, and MACD can be applied to bazaar data, but
              their effectiveness varies due to the unique characteristics of virtual economies.
            </p>
            <p>
              Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Support
              and resistance levels form through player psychology and game mechanics rather than fundamental value.
              Chart patterns may have different reliability compared to traditional markets.
            </p>
            <p>
              Phasellus ultrices nulla quis nibh. Quisque a lectus. Volume analysis provides insights into market
              participation and trend strength. Unusual volume spikes often precede significant price movements and may
              indicate insider information about upcoming game updates.
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
