'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Upload,
  Type,
  Trash2,
  Download,
  RotateCcw,
  Square,
  Circle,
  Minus,
  Bold,
  Italic,
  Save,
} from 'lucide-react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { assetsDB } from '@/services/assetsDB'

interface ImageEditTabProps {
  projectId: string
  projectName: string
}

export function ImageEditTab({ projectId, projectName }: ImageEditTabProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#1a56db')
  const [fontSize, setFontSize] = useState(24)
  const [textValue, setTextValue] = useState('Your Text Here')

  const initFabric = useCallback(async () => {
    if (typeof window === 'undefined' || !canvasRef.current) return
    if (fabricRef.current) return

    const { fabric } = await import('fabric')
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 450,
      backgroundColor: '#ffffff',
    })
    fabricRef.current = canvas
    setIsReady(true)
  }, [])

  useEffect(() => {
    initFabric()
    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose()
        fabricRef.current = null
      }
    }
  }, [initFabric])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !fabricRef.current) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const { fabric } = await import('fabric')
      fabric.Image.fromURL(ev.target?.result as string, (img: any) => {
        const canvas = fabricRef.current
        const scale = Math.min(
          (canvas.width! * 0.9) / (img.width || 1),
          (canvas.height! * 0.9) / (img.height || 1)
        )
        img.scale(scale)
        img.set({ left: 50, top: 50 })
        canvas.add(img)
        canvas.renderAll()
      })
    }
    reader.readAsDataURL(file)
  }

  const addText = async () => {
    if (!fabricRef.current) return
    const { fabric } = await import('fabric')
    const text = new fabric.IText(textValue, {
      left: 100,
      top: 100,
      fontSize,
      fill: selectedColor,
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 'bold',
    })
    fabricRef.current.add(text)
    fabricRef.current.setActiveObject(text)
    fabricRef.current.renderAll()
  }

  const addRectangle = async () => {
    if (!fabricRef.current) return
    const { fabric } = await import('fabric')
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 150,
      height: 80,
      fill: selectedColor,
      rx: 8,
      ry: 8,
    })
    fabricRef.current.add(rect)
    fabricRef.current.renderAll()
  }

  const addCircle = async () => {
    if (!fabricRef.current) return
    const { fabric } = await import('fabric')
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: selectedColor,
    })
    fabricRef.current.add(circle)
    fabricRef.current.renderAll()
  }

  const addLine = async () => {
    if (!fabricRef.current) return
    const { fabric } = await import('fabric')
    const line = new fabric.Line([100, 100, 300, 100], {
      stroke: selectedColor,
      strokeWidth: 3,
    })
    fabricRef.current.add(line)
    fabricRef.current.renderAll()
  }

  const deleteSelected = () => {
    if (!fabricRef.current) return
    const active = fabricRef.current.getActiveObject()
    if (active) {
      fabricRef.current.remove(active)
      fabricRef.current.renderAll()
    }
  }

  const clearCanvas = () => {
    if (!fabricRef.current) return
    fabricRef.current.clear()
    fabricRef.current.backgroundColor = '#ffffff'
    fabricRef.current.renderAll()
  }

  const exportImage = () => {
    if (!fabricRef.current) return
    const dataUrl = fabricRef.current.toDataURL({ format: 'png', multiplier: 2 })
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `edited-image-${Date.now()}.png`
    link.click()
    toast.success('Image exported!')
  }

  const saveToExplore = async () => {
    if (!fabricRef.current) return
    const dataUrl = fabricRef.current.toDataURL({ format: 'png', multiplier: 2 })
    const asset = {
      id: uuidv4(),
      projectId,
      projectName,
      type: 'edited-image' as const,
      url: dataUrl,
      createdAt: new Date().toISOString(),
      name: 'Edited Image',
    }
    await assetsDB.save(asset)
    toast.success('Saved to Explore!')
  }

  const COLORS = ['#1a56db', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#000000', '#ffffff']

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-wrap items-center gap-3">
        {/* Upload */}
        <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl px-3 py-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
          <Upload className="w-3.5 h-3.5" />
          Upload Image
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>

        <div className="w-px h-6 bg-gray-200" />

        {/* Text input */}
        <input
          type="text"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          className="border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs w-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Text..."
        />

        {/* Font size */}
        <select
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="border border-gray-200 rounded-xl px-2 py-1.5 text-xs focus:outline-none"
        >
          {[12, 16, 20, 24, 32, 40, 48, 64].map((s) => (
            <option key={s} value={s}>{s}px</option>
          ))}
        </select>

        <button
          onClick={addText}
          disabled={!isReady}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl px-3 py-2 hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          <Type className="w-3.5 h-3.5" />
          Add Text
        </button>

        <div className="w-px h-6 bg-gray-200" />

        {/* Shapes */}
        <button onClick={addRectangle} disabled={!isReady} className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors text-gray-600" title="Rectangle">
          <Square className="w-4 h-4" />
        </button>
        <button onClick={addCircle} disabled={!isReady} className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors text-gray-600" title="Circle">
          <Circle className="w-4 h-4" />
        </button>
        <button onClick={addLine} disabled={!isReady} className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors text-gray-600" title="Line">
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-200" />

        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${selectedColor === c ? 'border-blue-500 scale-110' : 'border-gray-200'}`}
              style={{ background: c }}
            />
          ))}
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-5 h-5 rounded cursor-pointer border border-gray-200"
            title="Custom color"
          />
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Actions */}
        <button onClick={deleteSelected} disabled={!isReady} className="flex items-center gap-1.5 text-xs font-medium text-red-500 border border-red-100 rounded-xl px-3 py-2 hover:bg-red-50 transition-colors disabled:opacity-50">
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
        <button onClick={clearCanvas} disabled={!isReady} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50">
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </button>
        <button onClick={saveToExplore} disabled={!isReady} className="flex items-center gap-1.5 text-xs font-medium text-teal-600 border border-teal-100 rounded-xl px-3 py-2 hover:bg-teal-50 transition-colors disabled:opacity-50">
          <Save className="w-3.5 h-3.5" />
          Save to Explore
        </button>
        <button onClick={exportImage} disabled={!isReady} className="flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl px-3 py-2 transition-colors disabled:opacity-50">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      {/* Canvas */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex items-center justify-center p-4">
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner" style={{ maxWidth: '100%', overflowX: 'auto' }}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  )
}
