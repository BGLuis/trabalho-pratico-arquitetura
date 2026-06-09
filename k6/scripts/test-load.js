import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 500 },
    { duration: '15s', target: 2000 },
    { duration: '10s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  const randomStr = Math.random().toString(36).substring(2, 7);
  // Ensure exactly 11 digits for CPF
  const randomCpf = Math.floor(10000000000 + Math.random() * 89999999999).toString();
  
  const payload = JSON.stringify({
    name: `Student ${__VU} ${__ITER}`,
    birthDate: '2000-01-01T00:00:00.000Z',
    cpf: randomCpf,
    phone: '+5511999999999',
    email: `student_${__VU}_${__ITER}_${randomStr}@test.com`,
    fullAddress: 'Rua de Teste, 123, Bairro, Cidade'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // 1. Criar Aluno (POST)
  let postRes = http.post(`${BASE_URL}/students`, payload, params);
  check(postRes, {
    'post status is 201 or 400 (if duplicate cpf)': (r) => r.status === 201 || r.status === 400,
  });

  // 2. Listar com Offset Pagination
  let getResOffset = http.get(`${BASE_URL}/students?page=1&limit=20`);
  check(getResOffset, {
    'get offset status is 200': (r) => r.status === 200,
  });

  // 3. Listar com Cursor Pagination
  let getResCursor = http.get(`${BASE_URL}/students?limit=20`);
  check(getResCursor, {
    'get cursor status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
