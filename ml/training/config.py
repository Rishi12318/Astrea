from dataclasses import dataclass


@dataclass(frozen=True)
class TrainingConfig:
    image_size: int = 224
    batch_size: int = 16
    epochs: int = 3
    learning_rate: float = 1e-4
    weight_decay: float = 1e-4
    num_classes: int = 5
    checkpoint_name: str = "skin_tone_model.pt"
    history_name: str = "training_history.json"
