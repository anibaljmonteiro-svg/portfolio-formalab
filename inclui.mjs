// Texto comercial para o cliente: o que inclui, o que não inclui e o que precisamos de si.
// Regras: linguagem simples e comercial; sem nomes de pessoas; sem promessas que a oferta não tenha.
const ext='Domínio, email profissional, licenças e subscrições de terceiros (custos externos, identificados à parte e pagos pelo titular)';
const siteNao=[ext,'Textos, fotografias e vídeos além do pacote: serviço à parte, orçamentado em separado','Alterações para além das rondas incluídas','Funcionalidades que não estão descritas na opção escolhida','Criação de logótipo (serviço à parte)'];
const sitePrec=['Logótipo, textos e fotografias (ou a nossa produção, à parte)','Acesso ao domínio e às contas do negócio (Google, redes), quando existirem','Uma pessoa do seu lado que aprove cada ronda de alterações dentro do prazo'];
const siteInc=['Adaptação ao telemóvel e ao computador','Apresentação de serviços e contactos','Publicação do site no endereço do cliente','Testes antes da entrega, validados consigo'];
const appNao=['Utilizadores ou estabelecimentos acima da referência do plano: avaliados à parte','Importação ou migração de dados: orçamento após análise','Integração técnica especial: sob análise','Limites do plano: confirmados na proposta'];

export const INCL={
 simples:{inc:['1 página, com até 5 secções',...siteInc,'Produção e inserção das fotografias, até ao limite do pacote','2 rondas de ajustes'],nao:['Mais de 1 página ou mais de 1 língua',...siteNao],prec:sitePrec},
 mediano:{inc:['Até 5 páginas, cada uma com endereço próprio',...siteInc,'Contactos e formulários simples, com preparação técnica para ser encontrado na pesquisa','Produção e inserção das fotografias, até ao limite do pacote','2 rondas de ajustes'],nao:['Editor de conteúdos e tradução: avaliados à parte',...siteNao],prec:sitePrec},
 profissional:{inc:['Até 10 páginas, cada uma com endereço próprio',...siteInc,'Produção e inserção das fotografias, até ao limite do pacote','Rondas de ajustes definidas na proposta'],nao:['Editor de conteúdos e tradução: avaliados à parte','Funcionalidades especiais: avaliadas à parte',...siteNao],prec:sitePrec},
 siteMonth:{inc:['Alojamento do site','Atualizações, cópias de segurança e verificações técnicas','Limites do serviço acordados na proposta'],nao:['Novas páginas, novos conteúdos ou novas funcionalidades','Pedidos fora do âmbito acordado'],prec:['Uma pessoa do seu lado para os pedidos de alteração']},
 agenda:{inc:['Marcações online com a imagem do seu negócio','Área de gestão e acesso do cliente, conforme o âmbito contratado','Implementação: marca, serviços, horários e configuração base','Gestão técnica da aplicação incluída na subscrição, sem custo de manutenção à parte'],nao:appNao,prec:['Serviços, durações e horários','Quem usa a aplicação e o que cada pessoa pode ver']},
 obra:{inc:['Gestão da operação da empresa, com acesso do cliente conforme o âmbito contratado','Implementação: configuração da empresa, acessos e apresentação','Gestão técnica da aplicação incluída na subscrição, sem custo de manutenção à parte'],nao:appNao,prec:['Como funciona hoje o trabalho e quem usa a aplicação','Que informação precisa de consultar todos os dias']},
 aulas:{inc:['Marcação de aulas e sessões em grupo (ginásio, pilates e outras atividades)','O cliente vê o horário da sessão e é avisado se a turma está cheia','Gestão das aulas e acesso do cliente, conforme o âmbito contratado','Implementação: configuração base da aplicação','Gestão técnica da aplicação incluída na subscrição, sem custo de manutenção à parte'],nao:appNao,prec:['Sessões, horários e lotação de cada aula','Quem dá as sessões e em que espaço']},
 integration:{inc:['Ligação da aplicação ao site, para o cliente marcar sem sair do seu endereço'],nao:['Integração técnica especial: sob análise'],prec:['Acesso ao site onde a aplicação vai ser ligada']},
 googleNew:{inc:['Uma localização','Configuração inicial com a informação e os materiais fornecidos','Orientação para a verificação pedida pela Google'],nao:['Gestão mensal do perfil','Sessões fotográficas','Anúncios','Qualquer promessa de posição nos resultados da Google'],prec:['Acesso de gestor ao perfil ou à conta Google do negócio','Informação correta: horários, serviços e contactos','Fotografias do negócio (ou produção à parte)','Poder receber o código de verificação da Google']},
 googleImprove:{inc:['Uma localização','Revisão de categorias, descrição, contactos, horários, serviços e fotografias fornecidas','Orientação para pedir avaliações genuínas'],nao:['Gestão mensal do perfil','Sessões fotográficas','Anúncios','Qualquer promessa de posição nos resultados da Google'],prec:['Acesso de gestor ao perfil','Informação correta: horários, serviços e contactos','Fotografias do negócio']},
 domainSetup:{inc:['Ligação ou configuração do domínio, em nome do cliente'],nao:['Renovação do domínio, paga ao fornecedor'],prec:['Acesso ao domínio, se já existir']},
 emailSetup:{inc:['Configuração de cada caixa de email profissional'],nao:['Migração de mensagens antigas','Licenças de terceiros (custo externo)'],prec:['Quem vai usar cada caixa']},
 photo:{inc:['Produção e edição final de cada fotografia'],nao:['Sessão e deslocação: confirmadas na proposta'],prec:['Dia e local da sessão']},
 text:{inc:['Redação de uma página de texto'],nao:['Extensão e revisões além do acordado'],prec:['Informação sobre o negócio e os serviços']},
 logo:{inc:['Criação do logótipo'],nao:['Entregáveis e revisões além do acordado'],prec:['Nome do negócio e referências que lhe agradem']}
};
export const PRIMEIRO_MES={
 linha:'Acompanhamento do 1.º mês após a publicação: incluído',
 inc:['Testes finais consigo','Correção de erros: algo que foi entregue e não funciona como combinado','Ajustes técnicos de arranque'],
 nao:['Novos conteúdos, páginas ou funcionalidades e pedidos fora do âmbito: passam para o acompanhamento mensal ou para orçamento à parte']
};
