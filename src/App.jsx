import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CoreSizes from './pages/CoreSizes'
import Measurements from './pages/Measurements'
import StoreList from './pages/StoreList'
import StoreDetail from './pages/StoreDetail'
import AddEditStore from './pages/AddEditStore'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/core-sizes" element={<CoreSizes />} />
        <Route path="/measurements" element={<Measurements />} />
        <Route path="/stores" element={<StoreList />} />
        <Route path="/stores/:id" element={<StoreDetail />} />
        <Route path="/stores/new" element={<AddEditStore />} />
        <Route path="/stores/:id/edit" element={<AddEditStore />} />
      </Routes>
    </BrowserRouter>
  )
}