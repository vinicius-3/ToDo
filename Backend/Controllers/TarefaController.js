import Tarefa from "../Models/Tarefa.js";

function formatDateToMySQL(dateInput) {
  if (!dateInput) return null;
  const dateStr = String(dateInput).trim();
  // Se já vier no formato YYYY-MM-DD (ou ISO começando com YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return dateStr.slice(0, 10);
  }
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

export default class tarefaController {
  static async create(req, res) {
    const { titulo, descricao, dataLimite, situacao } = req.body;

    if (!titulo) {
      return res.status(422).json({ message: "Preencha o Título" });
    }
    if (!descricao) {
      return res.status(422).json({ message: "Preencha a Descrição" });
    }
    if (!dataLimite) {
      return res.status(422).json({ message: "Preencha a data limite" });
    }
    if (!situacao) {
      return res.status(422).json({ message: "Situação é obrigatória" });
    }

    const dataFormatada = formatDateToMySQL(dataLimite);
    if (!dataFormatada) {
      return res.status(422).json({ message: "Data limite inválida" });
    }

    const tarefa = new Tarefa({
      titulo,
      descricao,
      dataLimite: dataFormatada,
      situacao,
    });

    try {
      const novatarefa = await tarefa.save();
      return res.status(200).json({ message: "Tarefa inserida com sucesso!", novatarefa });
    } catch (error) {
      return res.status(500).json({ message: "Problema ao inserir a tarefa", error: error.message });
    }
  };

  static async remove(req, res) {
    const { id } = req.params;

    if (!Tarefa.isValidId(id)) {
      return res.status(422).json({ message: "Id inválido" });
    }

    try {
      const tarefa = await Tarefa.findById(id);
      if (!tarefa) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      await Tarefa.deleteById(id);
      return res.status(200).json({ message: "Tarefa removida com sucesso!!" });
    } catch (error) {
      return res.status(500).json({ message: "Problema ao remover a tarefa", error: error.message });
    }
  };

  static async getAll(req, res) {
    try {
      const tarefas = await Tarefa.findAll();
      return res.status(200).json({ tarefas });
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar todas as tarefas", error: error.message });
    }
  };
}