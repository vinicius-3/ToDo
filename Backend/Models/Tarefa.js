import conn from "../db/conn.js";

export default class Tarefa {
  constructor({ id = null, titulo, descricao, dataLimite, situacao, createdAt = null, updatedAt = null }) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.dataLimite = dataLimite;
    this.situacao = situacao;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static isValidId(id) {
    return /^\d+$/.test(String(id)) && Number(id) > 0;
  }

  async save() {
    const sql = `
      INSERT INTO tarefas (titulo, descricao, dataLimite, situacao)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await conn.execute(sql, [
      this.titulo,
      this.descricao,
      this.dataLimite,
      this.situacao,
    ]);
    return Tarefa.findById(result.insertId);
  }

  static async findAll() {
    const sql = `
      SELECT id, titulo, descricao, dataLimite, situacao, createdAt, updatedAt
      FROM tarefas
      ORDER BY createdAt DESC
    `;
    const [rows] = await conn.execute(sql);
    return rows;
  }

  static async findById(id) {
    const sql = `
      SELECT id, titulo, descricao, dataLimite, situacao, createdAt, updatedAt
      FROM tarefas
      WHERE id = ?
    `;
    const [rows] = await conn.execute(sql, [id]);
    return rows[0] || null;
  }

  static async updateSituacao(id, situacao) {
    const sql = `
      UPDATE tarefas
      SET situacao = ?
      WHERE id = ?
    `;
    const [result] = await conn.execute(sql, [situacao, id]);
    if (result.affectedRows === 0) return null;
    return Tarefa.findById(id);
  }

  static async updateCompleta(id, { titulo, descricao, dataLimite, situacao }) {
    const sql = `
      UPDATE tarefas
      SET titulo = ?, descricao = ?, dataLimite = ?, situacao = ?
      WHERE id = ?
    `;
    const [result] = await conn.execute(sql, [
      titulo,
      descricao,
      dataLimite,
      situacao,
      id,
    ]);
    if (result.affectedRows === 0) return null;
    return Tarefa.findById(id);
  }

  static async deleteById(id) {
    const sql = `DELETE FROM tarefas WHERE id = ?`;
    const [result] = await conn.execute(sql, [id]);
    return result.affectedRows > 0;
  }
}