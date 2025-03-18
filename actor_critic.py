import numpy as np

class Actor:
    def __init__(self, state_size, action_size):
        self.state_size = state_size
        self.action_size = action_size
        self.policy = np.random.rand(state_size, action_size)  # Random policy

    def act(self, state):
        # Choose action based on the policy
        action_probs = self.policy[state]
        return np.random.choice(self.action_size, p=action_probs)

class Critic:
    def __init__(self, state_size):
        self.state_size = state_size
        self.value_function = np.zeros(state_size)  # Initialize value function

    def evaluate(self, state):
        # Return estimated value of the state
        return self.value_function[state]

class ActorCriticAgent:
    def __init__(self, state_size, action_size):
        self.actor = Actor(state_size, action_size)
        self.critic = Critic(state_size)

    def train(self, state, action, reward, next_state):
        # Update actor and critic based on the received reward
        td_target = reward + self.critic.evaluate(next_state)
        td_error = td_target - self.critic.evaluate(state)

        # Update the critic's value function
        self.critic.value_function[state] += 0.1 * td_error  # Learning rate

        # Update the actor's policy
        self.actor.policy[state][action] += 0.1 * td_error  # Learning rate

# Example usage
if __name__ == "__main__":
    agent = ActorCriticAgent(state_size=5, action_size=2)
    state = 0
    action = agent.actor.act(state)
    reward = 1  # Example reward
    next_state = 1
    agent.train(state, action, reward, next_state)