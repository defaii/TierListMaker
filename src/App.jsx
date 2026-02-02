import Header from './components/Header'
import TierListMaker from './components/TierListMaker'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
    return (
        <ErrorBoundary>
            <Header />
            <TierListMaker />
        </ErrorBoundary>
    )
}

export default App
