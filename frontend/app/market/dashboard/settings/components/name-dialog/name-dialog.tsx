"use client"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormLabel, FormMessage, FormControl, FormItem, FormField } from "@/components/ui/form"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUser } from "../../../context/user-content"
import { useToast } from "@/hooks/use-toast"
import { userService } from "@/services/user"

export const NameDialog = () => {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { user, setUser } = useUser()

  const formSchema = z.object({
    name: z.string().min(1, { message: "O nome deve ter pelo menos 1 caracter" })
  })

  type formSchema = z.infer<typeof formSchema>

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    }
  })

  const onSubmit = async (data: formSchema) => {
    try {
      await userService.updateUser(data)
      setUser((prev) => {
        if (!prev) return null
        
        return {
          ...prev,
          name: data.name
        }
      })
      toast({
        title: "Nome alterado",
        description: "Nome alterado com sucesso"
      })
    } catch (error) {
      toast({
        title: "Erro interno",
        description: "Ocorreu um erro interno e não foi possível processar sua solicitação. Por favor tentw novamente mais tarde"
      })
    } finally {
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Nome</DialogTitle>
          <DialogDescription>Atualize seu nome completo. Clique em salvar quando terminar.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Salvar alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}