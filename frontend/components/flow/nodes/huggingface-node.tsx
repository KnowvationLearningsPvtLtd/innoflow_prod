"use client"

import { useState, useEffect } from "react"
import { Handle, Position } from "reactflow"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAIModelsByProvider, AIModelConfig } from "@/lib/api/ai"

export function HuggingFaceNode({ data, isConnectable }: { data: any; isConnectable?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [settings, setSettings] = useState({
    model: data.model || "",
    temperature: data.temperature || 0.7,
    maxTokens: data.maxTokens || 1024,
    topP: data.topP || 1.0,
    topK: data.topK || 50,
    doSample: data.doSample || true
  })

  const [availableModels, setAvailableModels] = useState<AIModelConfig[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHuggingFaceModels()
  }, [])

  const loadHuggingFaceModels = async () => {
    try {
      setLoading(true)
      const modelsByProvider = await getAIModelsByProvider()
      
      const hfModels = modelsByProvider.HUGGINGFACE || []
      setAvailableModels(hfModels)
      
      if (!settings.model && hfModels.length > 0) {
        setSettings(prev => ({ ...prev, model: hfModels[0].model_name }))
      }
    } catch (error) {
      console.error('Failed to load HuggingFace models:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    if (data.onSettingsChange) {
      data.onSettingsChange({ ...settings, [key]: value })
    }
  }

  const selectedModel = availableModels.find(m => m.model_name === settings.model)

  return (
    <div className="w-64 rounded-md border border-yellow-500/40 bg-black/80 shadow-md backdrop-blur-sm relative">
      <div className="border-b border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm font-medium text-yellow-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          🤗
          <span>{data.label || "HuggingFace"}</span>
          <Badge variant="outline" className="ml-auto text-xs border-yellow-500/30 text-yellow-400">
            Open Source
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto p-1 w-7 h-7 text-yellow-400 hover:bg-yellow-500/10"
            onClick={() => { data.onRun ? data.onRun() : alert('Run HuggingFace Model!') }}
            aria-label="Run HuggingFace Model"
          >
            <Play className="w-4 h-4" />
          </Button>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-yellow-400 hover:text-yellow-300"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div>
          <label className="text-xs text-white/70 block mb-1">Model</label>
          {loading ? (
            <div className="h-8 bg-black/30 border border-white/10 rounded animate-pulse flex items-center px-2">
              <span className="text-xs text-white/50">Loading models...</span>
            </div>
          ) : (
          <Select 
              value={settings.model} 
              onValueChange={(value) => updateSetting("model", value)}
          >
            <SelectTrigger className="h-8 text-xs bg-black/30 border-white/10">
                <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white">
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.model_name}>
                    <div className="flex items-center gap-2">
                      <span>🤗</span>
                      <span>{model.model_name}</span>
                    </div>
                  </SelectItem>
                ))}
                {availableModels.length === 0 && (
                  <SelectItem value="no-models" disabled>
                    No HuggingFace models configured
                  </SelectItem>
                )}
            </SelectContent>
          </Select>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/70">Temperature</label>
            <span className="text-xs text-white/70">{settings.temperature.toFixed(2)}</span>
          </div>
          <Slider
            min={0}
            max={2}
            step={0.01}
            value={[settings.temperature]}
            onValueChange={(value) => updateSetting("temperature", value[0])}
            className="[&>span]:bg-yellow-500"
          />
        </div>

            <div>
              <div className="flex justify-between mb-1">
            <label className="text-xs text-white/70">Max Tokens</label>
            <span className="text-xs text-white/70">{settings.maxTokens}</span>
              </div>
              <Slider
            min={16}
            max={2048}
            step={16}
            value={[settings.maxTokens]}
            onValueChange={(value) => updateSetting("maxTokens", value[0])}
            className="[&>span]:bg-yellow-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-white/70">Top P</label>
                <span className="text-xs text-white/70">{settings.topP.toFixed(2)}</span>
              </div>
              <Slider
            min={0}
                max={1}
            step={0.01}
                value={[settings.topP]}
                onValueChange={(value) => updateSetting("topP", value[0])}
            className="[&>span]:bg-yellow-500"
              />
            </div>
            
        {selectedModel && (
          <div className="pt-1 border-t border-white/10">
            <div className="text-xs text-white/50">
              <div>Config: {selectedModel.name}</div>
              <div>Model Type: {selectedModel.model_type}</div>
            </div>
            </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        id="in"
        isConnectable={isConnectable}
        className="w-2 h-2 bg-yellow-500 border border-black"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        isConnectable={isConnectable}
        className="w-2 h-2 bg-yellow-500 border border-black"
      />
    </div>
  )
}