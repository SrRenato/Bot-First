exports.run = async (client, message) => {
  message.content === "!help";

  message.reply(` !play [musica]          
                   !skip = pula musica     
                   !stop = para a musica   
                   !oi                     
                   !sac                    
                   !delete                 
                   !ping                   
                   !dog                    
                   !cat   
                   !memes
                   !coinflip                 
                   `);
};
